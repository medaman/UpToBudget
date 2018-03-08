const moment = require('moment');
module.exports = (sequelize, DataTypes)=>{
  const histories = sequelize.define('histories',
  {
    monthly_income :
    {
      type : DataTypes.DECIMAL(12,4)
    }
  });

  histories.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    histories.belongsTo(models.clients, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return histories;
}
