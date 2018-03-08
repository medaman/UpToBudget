module.exports = (sequelize, DataTypes)=>{
  const goals = sequelize.define('goals',{
    cost :
    {
      type : DataTypes.DECIMAL(12,2)
    },
    item_name :
    {
      type : DataTypes.STRING
    },
    completed :
    {
      type : DataTypes.BOOLEAN,
      defaultValue : false
    },
    monthly_recurring :
    {
      type : DataTypes.INTEGER
    },
    total_invested :
    {
      type : DataTypes.INTEGER
    }
  });

  goals.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    goals.belongsTo(models.clients, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return goals;
}
