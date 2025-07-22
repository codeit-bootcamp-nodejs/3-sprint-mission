import prisma from "../config/prisma"

const createUser = async (user) => {
  /**
 * TODO
 * 
 * 1. 사용자가 입력한 이메일이 사용중인 이메일인지 확인 (이메일 중복 사용 여부)
 * - 만일 이메일이 사용 중이라면 회원가입 되지 않도록 함
 * 
 * 2. 이메일이 사용중이 아니라면, 입력받은 사용자를 데이터베이스에 저장
 * - 새로 가입된 사용자 정보를 생성된 `id`와 함께 반환
 * - 이때, `password`와 같은 유저의 민감 정보는 반환되지 않아야 함
 * - `filterSensitiveUserData` 와 같은 메서드를 작성해서 노출되지 않도록 할 예정
 */
  const email = req.body.email

  const existedUser = await prisma.user.findUnique({
    where: {
      email: email
    }
  })

  // if (existedUser) {
  //   const error = await 
  // }
}