import DAOUser from '../DAO/DAOUser';
import User from '../models/user';

class UserService{
    public async signIn(username: string, password: string): Promise<User|undefined>{
        return await DAOUser.get(username, password);
    }
}

const userService = new UserService();
export default userService;