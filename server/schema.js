export const typeDefs = `#graphql
type User{
    _id: ID,
    username:string,
     email: string,
     password:string
}
type Query{
    user:[User]
}
`;
