module.exports = (sequelize, DataTypes) => {
  const reserved_ticket = sequelize.define(
    'reserved_ticket',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      token: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      ticket_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'tickets',
          key: 'id',
        },
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );

  reserved_ticket.associate = (models) => {
    reserved_ticket.belongsTo(models.ticket, { foreignKey: 'ticket_id' });
  };

  return reserved_ticket;
};
