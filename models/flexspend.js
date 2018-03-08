
module.exports = (sequelize, DataTypes)=>{
  const flexspend = sequelize.define('flexspend',{
    cost :
    {
      type : DataTypes.DECIMAL(12,2)
    },
    item_name : {
      type : DataTypes.STRING
    }
  });

  flexspend.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    flexspend.belongsTo(models.clients, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return flexspend;
}
