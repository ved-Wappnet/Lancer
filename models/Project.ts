import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";

export type ProjectStatus = 0 | 1 | 2 | 3; // 0 = Draft, 1 = Active, 2 = Completed, 3 = In Review

export interface ProjectAttributes {
  id: number;
  title: string;
  description: string;
  category: number;
  budget: string;
  deadline?: string | null;
  status: ProjectStatus;
  skillsRequired?: string[];
}

export interface ProjectCreationAttributes extends Optional<ProjectAttributes, "id" | "deadline" | "status" | "skillsRequired"> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public category!: number;
  public budget!: string;
  public deadline?: string | null;
  public status!: ProjectStatus;
  public skillsRequired?: string[]; // New field

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
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
    category: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    budget: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // 0 = Draft, 1 = Active, 2 = Completed, 3 = In Review
    },
    skillsRequired: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      get(this: Model): string[] {
        const raw: string | null = this.getDataValue('skillsRequired');
        if (!raw) return [];
        return raw.split(',').map(s => s.trim()).filter(Boolean);
      },
      set(this: Model, val: string[] | undefined) {
        if (Array.isArray(val)) {
          if (val.length === 0) {
            this.setDataValue('skillsRequired', null);
          } else {
            this.setDataValue('skillsRequired', val.join(','));
          }
        } else {
          this.setDataValue('skillsRequired', null);
        }
      }
    },
  },
  {
    sequelize,
    modelName: "Project",
    tableName: "projects",
  }
);

export default Project;
