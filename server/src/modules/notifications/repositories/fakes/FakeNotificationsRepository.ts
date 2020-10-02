import { ObjectID } from 'mongodb';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';


class FakeNotificationsRepository implements INotificationsRepository{
    private notifications: Notification[] = [];

    public async create(obj: ICreateNotificationDTO): Promise<Notification> {
        const notification = new Notification();
        
        Object.assign(notification, {id: new ObjectID(), content: obj.content, recipient_id: obj.recipient_id});
        
        this.notifications.push(notification);

        return notification;
    }
}

export default FakeNotificationsRepository;