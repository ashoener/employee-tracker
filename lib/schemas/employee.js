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
    roleId: {
      type: DataTypes.INTEGER,
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

Employee.belongsTo(Role);

export default Employee;
