module.exports = (sequelize, DataTypes) => {
  const ticket = sequelize.define(
    'ticket',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      event_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'events',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.ENUM,
        values: ['general_admission', 'vip', 'backstage_pass'],
        allowNull: true,
      },
      unit_price: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
        defaultValue: 0,
      },
      total_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      available_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );

  ticket.associate = (models) => {
    ticket.hasMany(models.reserved_ticket, {
      foreignKey: 'ticket_id',
      onDelete: 'CASCADE',
    });
  };

  return ticket;
};
