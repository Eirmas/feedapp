import InviteEntity from './invite.entity';
import PollEntity from './poll.entity';
import UserEntity from './user.entity';
import VoteEntity from './vote.entity';
import DeviceEntity from './device.entity';

const entities = [UserEntity, PollEntity, InviteEntity, VoteEntity, DeviceEntity];

export { UserEntity, PollEntity, InviteEntity, VoteEntity, DeviceEntity };
export default entities;
