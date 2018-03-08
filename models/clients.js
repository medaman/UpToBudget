
module.exports = (sequelize, DataTypes)=>{
  const clients = sequelize.define('clients',{
    client_name :
    {
      allowNull : false,
      type      : DataTypes.STRING,
      validate  :
        {
          len : { args : [1,30], msg : "Must be between 1 and 30 characters."}
        }
    },
    google : {
      allowNull : false,
      type      : DataTypes.STRING
    },
    email : {
      type      : DataTypes.STRING
    },

    phone_number :
    {
      type : DataTypes.BIGINT
    },

    monthly_income :
    {
      type : DataTypes.DECIMAL(12,4)
    },

    job_title :
    {
      type : DataTypes.STRING
    },

    reminder :
    {
      type : DataTypes.DECIMAL(12,4),
      defaultValue : 0.9
    },

    current_savings :
    {
      type : DataTypes.DECIMAL(12,4)
    },

    minimum_savings :
    {
      type : DataTypes.DECIMAL(12,4)
    }
  });

  clients.associate = function(models) {
    clients.hasMany(models.fixedcosts, {
      onDelete: "cascade"
    });
    clients.hasMany(models.flexspend, {
      onDelete: "cascade"
    });
    clients.hasMany(models.goals, {
      onDelete: "cascade"
    });
    clients.hasMany(models.histories, {
      onDelete: "cascade"
    });
  };

  return clients;
}
