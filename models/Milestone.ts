import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";

export enum MilestoneStatusEnum {
  Upcoming = 1,
  InProgress = 2,
  Completed = 3,
  Delayed = 4
}

// Use string literal type for status
export type MilestoneStatus = 'upcoming' | 'in-progress' | 'completed' | 'delayed';

export interface MilestoneAttributes {
  id: number;
  title: string;
  description: string;
  projectId: number;
  dueDate: string;
  progress: number;
  status: MilestoneStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MilestoneCreationAttributes extends Optional<MilestoneAttributes, "id" | "createdAt" | "updatedAt"> {}

class Milestone extends Model<MilestoneAttributes, MilestoneCreationAttributes> implements MilestoneAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public projectId!: number;
  public dueDate!: string;
  public progress!: number;
  public status!: MilestoneStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Milestone.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    /**
     * Status is stored as a number (1: upcoming, 2: in-progress, 3: completed, 4: delayed)
     * The getter returns the string status for API/UI; the setter accepts a MilestoneStatus string only.
     */
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: MilestoneStatusEnum.Upcoming,

      set(val: MilestoneStatus | number) {
        let numVal: number = MilestoneStatusEnum.Upcoming;
        if (typeof val === 'number') {
          if (val >= 1 && val <= 4) {
            numVal = val;
          }
        } else {
          switch (val) {
            case 'upcoming': numVal = MilestoneStatusEnum.Upcoming; break;
            case 'in-progress': numVal = MilestoneStatusEnum.InProgress; break;
            case 'completed': numVal = MilestoneStatusEnum.Completed; break;
            case 'delayed': numVal = MilestoneStatusEnum.Delayed; break;
          }
        }
        this.setDataValue('status', numVal as unknown as MilestoneStatus);
      },
    },
  },
  {
    sequelize,
    modelName: "Milestone",
    tableName: "milestones",
  }
);

export default Milestone;
