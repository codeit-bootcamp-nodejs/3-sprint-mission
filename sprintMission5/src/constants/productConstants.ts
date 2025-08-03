export const VALIDATION_PRODUCT_ERRORS = {
  name: '상품 이름은 1자 이상 20자 이하로 입력해주세요.',
  description: '상품 설명은 최대 300자까지 가능합니다.',
  price: '가격은 0원 이상 1억 원 이하이어야 합니다.',
  tags: '태그는 각 1자 이상 20자 이하로 입력해주세요.',
};

export const PRODUCT_ERROR = {
  GET_PRODUCT_LIST_ERROR: "상품 목록을 가져오는 데 실패했습니다.",
  GET_PRODUCT_ERROR: "상품을 찾을 수 없습니다. 존재하지 않는 상품입니다.",
  CREATE_PRODUCT_ERROR: "상품 생성에 실패했습니다.",
  PATCH_PRODUCT_ERROR: "상품 업데이트에 실패했습니다.",
  DELETE_PRODUCT_ERROR: "상품 삭제에 실패했습니다.",
};