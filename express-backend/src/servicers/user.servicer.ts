import DAOUser from '../DAO/DAOUser';
import User from '../models/user';

class UserService{
    public async signIn(username: string, password: string): Promise<User|undefined>{
        return await DAOUser.get(username, password);
    }

    public async update(user: User): Promise<boolean>{
        return await DAOUser.update(user);
    }

    public async get(username: string): Promise<User|null>{
        return await DAOUser.exists(username);
    }

    public async getAll(): Promise<User[]>{
        return await DAOUser.getAll();
    }

    public async getByUsername(username:string): Promise<User | undefined>{
        return await DAOUser.get(username);
    }

    public async exists(username: string): Promise<User|null> {return await DAOUser.exists(username);}
    public async addUser(user: User): Promise<boolean>{
        return await DAOUser.add(new User(
            user.username,
            user.password,
            user.role,
            user.firstName,
            user.lastName,
            user.reimbursementFunds,
            user.department,
            user.supervisor,
            user.departmentHead,
            user.benCo
        ));
    }

    public async remove(user: User): Promise<boolean>{
        return await DAOUser.remove(user);
    }

    public async getUsersbyRole(role: string){
        return await DAOUser.getUsersbyRole(role);
    }
}

const userService = new UserService();
export default userService;