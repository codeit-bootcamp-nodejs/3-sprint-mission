import * as notiService from '../../src/notifications/notificationService.js';
import { CustomError } from '../../src/utils/CustomError.js';

describe('[Notifications] 잘못된 파라미터 검증', () => {
  test('목록 조회 400 (userId 비정수)', async () => {
    await expect(notiService.list('abc' as any)).rejects.toThrow(CustomError);
  });

  test('읽지 않은 개수 조회 400 (userId 음수)', async () => {
    await expect(notiService.countUnread(-1 as any)).rejects.toThrow(
      /사용자 ID/
    );
  });

  test('읽음 처리 400 (id 비정수)', async () => {
    await expect(notiService.markRead('x' as any, 1)).rejects.toThrow(
      /알림 ID/
    );
  });

  test('가격 변경 알림 생성 400 (recipientUserId 비정상)', async () => {
    await expect(
      notiService.createPriceChange({
        recipientUserId: -1,
        productId: 1,
        oldPrice: 10,
        newPrice: 9,
      })
    ).rejects.toThrow(/사용자 ID/);
  });

  test('새 댓글 알림 생성 400 (postId 비정상)', async () => {
    await expect(
      notiService.createNewComment({
        recipientUserId: 1,
        postId: NaN as any,
        commentId: 1,
      })
    ).rejects.toThrow(/게시글 ID/);
  });
});
