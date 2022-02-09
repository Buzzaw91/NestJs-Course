import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity'

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fake copy of the users service
        const users: User[] = [];

         fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {id: (Math.floor(Math.random() * 99999)) ,email, password} as User;
                users.push(user);
                return Promise.resolve(user)
            }
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

    it('throws if user signs up with an email that is already in use', async () => {
        await service.signup('asdf@example.com', 'qwertyqwerty');
        try {
            await service.signup('asdf@example.com', 'qwertyqwerty');
        } catch(err) {
           console.log(`Email in use: -------> ${err}`);
        }
    });

    it('throws if signin is called with an unused email', async () => {
        try {
            await service.signin('asdf@example.com', 'qwertyqwerty');
        } catch(err) {
            // console.log(`User not found: ${err}`);
        }
    });

    it('throws if invalid password is provided', async () => {
        await service.signup('asdf@asdf', 'notPassword');

        try {
            await service.signin('asdf@asdf', 'notPassword12345')
        } catch (err) {
            console.log('Wrong password: -------> ',err);
        }
    });

    it('returns a user if correct password is provided', async () => {
        await service.signup('test@test.com', 'password');

        const user = await service.signin('test@test.com', 'password');
        expect(user).toBeDefined();

    });
});

