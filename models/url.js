const { DataTypes, Model }       = require("sequelize"),
      bcrypt                     = require('bcrypt'),
      sequelize                  = global.sequelize,
      { default: ShortUniqueId } = require('short-unique-id'),
      uid                        = new ShortUniqueId({length: 6});

class Url extends Model
{
  static get uid() {
    return uid();
  }

  async validatePassword(value) {
    return bcrypt.compare(value, this.password);
  }

  async aggregateUrlVisits() {
    return Object.entries((await this.getUrlVisits()).reduce((acc, curr) => {
      const dateString = curr.createdAt.toISOString().split('T').shift();
      acc.hasOwnProperty(dateString) ? acc[dateString]++ : acc[dateString] = 1;
      return acc;
    }, {}));
  }
}

exports.Url = Url.init({
  shortUrl: {
    type: DataTypes.STRING(6),
    unique: true,
    defaultValue: Url.constructor.uid
  },
  url: {
    type: DataTypes.STRING(2048),
    allowNull: false,
    validate: {
      is: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('password', bcrypt.hashSync(value, 10));
    }
  }
}, { sequelize, modelName: "Url", tableName: "Urls", updatedAt: false });

const UrlVisit = sequelize.define(
  'UrlVisit', 
  {}, 
  {sequelize, modelName: 'UrlVisit', tableName: 'UrlVisits', updatedAt: false}
);

(async () => { 
  await UrlVisit.sync(); 
  Url.hasMany(UrlVisit, {
    foreignKey: {
      allowNull: false
    },
    onDelete: 'CASCADE'
  });
  UrlVisit.belongsTo(Url);
  await sequelize.sync();
})();

exports.UrlVisit = UrlVisit;