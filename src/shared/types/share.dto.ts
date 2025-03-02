export class SuccessResDTO<T> {
  statucCode: string
  data: T
  constructor(patial: Partial<SuccessResDTO<T>>) {
    Object.assign(this, patial)
  }
}
