import { getAuth} from "firebase/auth";
const auth = getAuth();

export default function auths(req, res, next){
    try {
      const user = auth.currentUser;
      if (user) {
        console.log(user.email);
          req.user = user;
        next();
      } else {
        return res.status(401).send({ error: 'Unauthorized (Not signed in)' });
      }
      } catch (error) {
        console.error('Error checking authentication state:', error);
        return res.status(500).send({ error: 'Internal server error' });
      }

}
