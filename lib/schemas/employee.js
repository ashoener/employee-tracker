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
Employee.belongsTo(Employee, {
  foreignKey: "managerId",
  as: "Manager",
});

export default Employee;
