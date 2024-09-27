import {AuthServicePort} from "../../core/ports/auth";

export const MockAuthService: jest.Mocked<AuthServicePort> = {
    authenticate: jest.fn(),
};