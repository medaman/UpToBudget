
module.exports = (sequelize, DataTypes)=>{
  const fixedcosts = sequelize.define('fixedcosts',{
    cost :
    {
      type : DataTypes.DECIMAL(12,2)
    },
    item_name : {
      type : DataTypes.STRING
    }
  });

  fixedcosts.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    fixedcosts.belongsTo(models.clients, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return fixedcosts;
}
