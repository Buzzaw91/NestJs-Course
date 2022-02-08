import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity'

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        // Create a fake copy of the users service
        const fakeUsersService: Partial<UsersService> = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({id: 1, email, password} as User )
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();

        service = module.get(AuthService);
    })

    it('can create an instance of Auth Service', async () => {

        expect(service).toBeDefined();
    });

    it('crates a new user with salted and hashed password',async () => {
        const user = await service.signup('asdf@example.com', 'qwertyqwerty');

        expect(user.password).not.toEqual('qwertyqwerty');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });
});

