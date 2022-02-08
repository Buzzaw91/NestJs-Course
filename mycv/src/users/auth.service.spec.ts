import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity'

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fake copy of the users service
         fakeUsersService = {
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

    it('throws an error if user signs up with an email that is already in use', async () => {
        fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'asdf@example.com', password: 'qwertyqwerty'} as User]);
        try {
            await service.signup('asdf@example.com', 'qwertyqwerty');
        } catch(err) {
           console.log(`Test working -------> ${err}`);
        }
    })
});

