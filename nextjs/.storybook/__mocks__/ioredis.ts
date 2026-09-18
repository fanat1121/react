class RedisMock {
  get = async () => null;
  set = async () => 'OK';
  setex = async () => 'OK';
  del = async () => 1;
  on = () => this;
}

export default RedisMock;
