import {JSONSchemaType} from "ajv";
import createAjvValidator from "../utils/createAjvValidator";

export type TTaskModel = {
  id: number,
  predictions: object[],
  annotations: (object & {id: number})[],
  drafts: (object & {
    id: number,
    annotation: number | null,
    result: Object[],
    comment_count?: number,
    unresolved_comment_count?: number,
    created_username: string,
    created_ago: string,
    created_at: string,
  })[],
  annotators: number[],
  inner_id: number,
  cancelled_annotations: number,
  total_annotations: number,
  total_predictions: number,
  completed_at?: string,
  // annotations_results: string,
  // predictions_results: string,
  file_upload?: string,
  storage_filename?: string,
  // annotations_ids: string,
  predictions_model_versions: string,
  updated_by: {user_id: number}[],
  reviewed_by: {user_id: number}[],
  reviewed_result?: string,
  qualified_by: {user_id: number}[],
  qualified_result?: string,
  data: {
    audio?: string,
    image?: string,
    video?: string,
    pcd?: string,
    channels?: number,
    duration?: number,
  },
  // meta: { [k: string]: any },
  created_at: string,
  updated_at: string,
  is_labeled: boolean,
  overlap: number,
  comment_count: number,
  unresolved_comment_count: number,
  last_comment_updated_at?: string,
  is_in_review: boolean,
  is_in_qc: boolean,
  project: number,
  comment_authors: number[],
  locked_by: number[],
  assigned_to: number[],
}

export const taskModelSchema: JSONSchemaType<TTaskModel> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    predictions: {type: "array", items: {type: "object", additionalProperties: true, required: []}},
    annotations: {type: "array", items: {type: "object", additionalProperties: true, required: []}},
    drafts: {type: "array", items: {type: "object", additionalProperties: true, required: []}},
    annotators: {type: "array", items: {type: "integer"}},
    inner_id: {type: "integer"},
    cancelled_annotations: {type: "integer"},
    total_annotations: {type: "number"},
    total_predictions: {type: "number"},
    completed_at: {type: "string", nullable: true},
    file_upload: {type: "string", nullable: true},
    storage_filename: {type: "string", nullable: true},
    predictions_model_versions: {type: "string"},
    updated_by: {
      type: "array",
      items: {
        type: "object",
        properties: {
          user_id: {type: "integer"},
        },
        required: [
          "user_id",
        ],
        additionalProperties: true,
      },
    },
    reviewed_by: {
      type: "array",
      items: {
        type: "object",
        properties: {
          user_id: {type: "integer"},
        },
        required: [
          "user_id",
        ],
        additionalProperties: true,
      },
    },
    reviewed_result: {type: "string", nullable: true},
    qualified_by: {
      type: "array",
      items: {
        type: "object",
        properties: {
          user_id: {type: "integer"},
        },
        required: [
          "user_id",
        ],
        additionalProperties: true,
      },
    },
    qualified_result: {type: "string", nullable: true},
    data: {
      type: "object",
      properties: {
        audio: {type: "string", nullable: true},
        video: {type: "string", nullable: true},
        image: {type: "string", nullable: true},
        pcd: {type: "string", nullable: true},
        channels: {type: "number", nullable: true},
        duration: {type: "number", nullable: true},
      },
      required: [],
      additionalProperties: true,
    },
    created_at: {type: "string"},
    updated_at: {type: "string"},
    is_labeled: {type: "boolean"},
    overlap: {type: "integer"},
    comment_count: {type: "integer"},
    unresolved_comment_count: {type: "integer"},
    last_comment_updated_at: {type: "string", nullable: true},
    is_in_review: {type: "boolean"},
    is_in_qc: {type: "boolean"},
    project: {type: "integer"},
    comment_authors: {type: "array", items: {type: "integer"}},
    locked_by: {type: "array", items: {type: "integer"}},
    assigned_to: {type: "array", items: {type: "integer"}},
  },
  required: [
    "id",
    "drafts",
    "annotators",
    "inner_id",
    "cancelled_annotations",
    "total_annotations",
    "total_predictions",
    "predictions_model_versions",
    "updated_by",
    "reviewed_by",
    "qualified_by",
    "data",
    "created_at",
    "updated_at",
    "is_labeled",
    "overlap",
    "comment_count",
    "unresolved_comment_count",
    "is_in_review",
    "is_in_qc",
    "project",
    "comment_authors",
    "locked_by",
    "assigned_to",
  ],
  additionalProperties: true,
}

export const validateTaskModel = createAjvValidator<TTaskModel>(taskModelSchema);
