export class CreateCategoryDTO {
  name: string;
  base64?: string;
}

export class UpdateCategoryDTO {
  id: string;
  name?: string;
  base64?: string | null;
}

export type CategoryAdminListItemDTO = {
  id: string;
  name: string;
  base64: string | null;
};

export type CategoryAdminDetailDTO = {
  id: string;
  name: string;
  base64: string | null;
};
