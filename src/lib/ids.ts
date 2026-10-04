/** API 요청 본문의 ID는 양의 정수여야 하므로 `member_10` 같은 응답 ID에서 숫자 부분을 추출한다. */
export function toNumericId(id: string | number): number {
  const numeric = typeof id === 'number' ? id : Number(id.match(/(\d+)$/)?.[1])
  if (!Number.isInteger(numeric) || numeric <= 0) throw new Error(`유효하지 않은 ID입니다: ${id}`)
  return numeric
}
