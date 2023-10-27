import db from "../db.js";
import Department from "./department.js";

import { DataTypes, Model } from "sequelize";

class Role extends Model {}

Role.init(
  {
    title: {
      type: DataTypes.STRING(30),
    },
    salary: {
      type: DataTypes.FLOAT,
    },
    departmentId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "role",
    underscored: true,
    sequelize: db,
    timestamps: false,
    freezeTableName: true,
  }
);

Role.belongsTo(Department);

export default Role;
