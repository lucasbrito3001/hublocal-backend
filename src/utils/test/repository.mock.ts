export class MockRepository {
    constructor() {}

    find = jest.fn()
    findOneBy = jest.fn()
    save = jest.fn()
    update = jest.fn()
    delete = jest.fn()
}