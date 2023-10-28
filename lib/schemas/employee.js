import db from "../db.js";
import Role from "./role.js";

import { DataTypes, Model } from "sequelize";

class Employee extends Model {}

Employee.init(
  {
    firstName: {
      type: DataTypes.STRING(30),
    },
    lastName: {
      type: DataTypes.STRING(30),
    },
    name: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: "id",
      },
    },
    managerId: {
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: "id",
      },
    },
  },
  {
    tableName: "employee",
    underscored: true,
    sequelize: db,
    timestamps: false,
    freezeTableName: true,
  }
);

Employee.belongsTo(Role, {
  onDelete: "SET NULL",
  onUpdate: "NO ACTION",
});
Employee.belongsTo(Employee, {
  foreignKey: "managerId",
  as: "Manager",
  onDelete: "SET NULL",
  onUpdate: "NO ACTION",
});

export default Employee;
