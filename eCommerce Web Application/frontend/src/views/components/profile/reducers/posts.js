//reduer equal a function that accepts the state and also it accepts
//the acitons then based on the action type

export default function postsReducer (posts = [],action) {
    switch (action.type) {
        case "UPDATE":
            return posts.map((post) => post._id === action.payload._id ? action.payload : post);
        case "FETCH_ALL":
            return action.payload;
        case "CREATE":
            return [...posts, action.payload];
        case 'DELETE':
            return posts.filter((post) => post._id !== action.payload);
        case 'DISABLE':
            return posts.map((post) => post._id === action.payload._id ? action.payload : post);
        default:
            return posts;
    }

}     