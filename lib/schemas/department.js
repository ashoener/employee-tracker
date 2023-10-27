import db from "../db.js";

import { DataTypes, Model } from "sequelize";

class Department extends Model {}

Department.init(
  {
    name: {
      type: DataTypes.STRING(30),
    },
  },
  {
    tableName: "department",
    sequelize: db,
    timestamps: false,
    freezeTableName: true,
  }
);

export default Department;
