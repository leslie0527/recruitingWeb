import gql from "graphql-tag";
export default {
    "reg":gql`mutation($username:String,$password:String){
        member{
          register(username:$username,password:$password){
            id,
            username
          }
        }
      }`
}