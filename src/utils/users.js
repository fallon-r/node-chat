const users = [];

const addUser = ({ id, username, room }) => {
  // *Clean data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // * Validate
  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }

  // * check if exists
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  //* validate user name
  if (existingUser) {
    return {
      error: "Username is taken",
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1);
  }
};

const getUser = (id) => {
  const exists = users.find((user) => user.id === id);
  if (exists !== undefined) {
    return exists;
  } else {
    return {error : "User does not exist"};
  }
};

const getUserInRoom = (room) =>{
    const exists = users.filter((user)=> user.room === room)
    if(exists.length !== 0){
        return exists
    }else{
        return {
            error: "No-one in this room"
        }
    }

}

addUser({
  id: 24,
  username: "Andrew",
  room: "room",
});
addUser({
  id: 28,
  username: "Balthazar",
  room: "room",
});

const user = getUser(24);

console.log(user)

const notUser = getUser(29)
console.log(notUser)

const roomContents = getUserInRoom("room")
console.log(roomContents)

const emptyRoom = getUserInRoom("empty")
console.log(emptyRoom)