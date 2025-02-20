const CryptoJS = require('crypto-js')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const base64 = require('base-64');
const paymentRoutes = require('./paymentRoutes');

const axios = require('axios');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use('/api/payments', paymentRoutes);
// MongoDB connection
mongoose.connect('mongodb+srv://seksikoleg5:se4HivNRYKdydnzc@cluster0.pdc2rrh.mongodb.net/botUsers?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    sendDate: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now },
    sent: { type: Boolean, default: false },
    isUrgent: { type: Boolean, default: false },
    imageUrl: { type: String }
});

const companyMemberSchema = new mongoose.Schema({
    name: { type: String },
    aboutMember: { type: String },
    photoLink: { type: String }
})

const sheludeSchema = new mongoose.Schema({
    numberMonth: { type: String },
    month: { type: String },
    schelude: { type: String }
})

const seminarSchema = new mongoose.Schema({
    title: { type: String },
    when: { type: String },
    where: { type: String },
    cost: { type: String },
    plan: { type: String }
})

const moduleSchema = new mongoose.Schema({
    title: { type: String },
    date: { type: Date },
    content: { type: String },
    cost: { type: Number },
    reminder: { type: String }
})

const UserSchema = new mongoose.Schema({
    user_id: { type: Number },
    last_interaction: { type: Number },
    first_name: { type: String },
    last_name: { type: String },
    payment_status: { type: String },
    state: { type: String },
    username: { type: String },
    contact: { type: String },
    direction: { type: String },
    format: { type: String },
    first_question: { type: String },
    second_question: { type: String },
    payment_status_module_1: { type: String },
    payment_status_module_2: { type: String },
    payment_status_module_3: { type: String },
    coment: { type: String },
    payment_date: { type: Date },
    subscription_end_date: { type: Date },
    subscription_start_date: { type: Date }
});
const subscriberShema = new mongoose.Schema({
    name: { type: String },
    userName: { type: String },
    order_id: { type: String }
})


const Subscriptions = mongoose.model('Subscriptions', subscriberShema)

const News = mongoose.model('News', newsSchema);
const Monthes = mongoose.model('Monthes', sheludeSchema);
const Seminars = mongoose.model('Seminars', seminarSchema);
const Users = mongoose.model('Users', UserSchema)
const Modules = mongoose.model('Modules', moduleSchema)

app.post('/api/news', async (req, res) => {
    const { title, content, sendDate, isUrgent, imageUrl } = req.body;

    if (!title || !content || !sendDate) {
        return res.status(400).json({ message: 'Title, content, and sendDate are required' });
    }

    const news = new News({ title, content, sendDate, isUrgent, imageUrl });

    try {
        await news.save();
        res.status(201).json({ message: 'News created' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/news', async (req, res) => {
    try {
        const news = await News.find();
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/schelude', async (req, res) => {
    try {
        const monthes = await Monthes.find();
        res.json(monthes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/seminar', async (req, res) => {
    try {
        const seminar = await Seminars.find();
        res.json(seminar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/module', async (req, res) => {
    try {
        const modules = await Modules.find();
        res.json(modules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const seminar = await Users.find();
        res.json(seminar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/getnews/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/getshelude/:id', async (req, res) => {
    try {
        const news = await Monthes.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/getseminar/:id', async (req, res) => {
    try {
        const seminars = await Seminars.findById(req.params.id);
        if (!seminars) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json(seminars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/getmodule/:id', async (req, res) => {
    try {
        const seminars = await Modules.findById(req.params.id);
        if (!seminars) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json(seminars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/news/urgent', async (req, res) => {
    try {
        const urgentNews = await News.find({ isUrgent: true });
        res.json(urgentNews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



app.put('/api/news/:id', async (req, res) => {
    console.debug(`Запрос на обновление новости с id: ${req.params.id}`);
    console.debug('Данные для обновления:', req.body);
    try {
        const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNews) {
            console.debug(`Новость с id ${req.params.id} не найдена`);
            return res.status(404).json({ message: 'News not found' });
        }
        console.debug('Новость успешно обновлена:', updatedNews);
        res.json(updatedNews);
    } catch (error) {
        console.error(`Ошибка при обновлении новости с id ${req.params.id}:`, error);
        res.status(400).json({ message: error.message });
    }
});


app.put('/api/schelude/:id', async (req, res) => {
    try {
        const updatedSchelude = await Monthes.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSchelude) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json(updatedSchelude);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/seminar/:id', async (req, res) => {
    try {
        const updatedSeminar = await Seminars.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSeminar) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json(updatedSeminar);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/module/:id', async (req, res) => {
    try {
        const updatedSeminar = await Modules.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSeminar) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json(updatedSeminar);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/users/:id/coment', async (req, res) => {
    const userId = req.params.id;
    const { coment } = req.body;

    try {
        const user = await Users.findByIdAndUpdate(
            userId,
            { coment },
            { new: true }
        );

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/api/news/:ids', async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.ids);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json({ message: 'News deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/check-payment-status', async (req, res) => {
    const { order_id } = req.body;

    const liqpay_data = {
        public_key: 'sandbox_i38312250017',
        version: '3',
        action: 'status',
        order_id: order_id
    };

    const liqpay_data_str = Buffer.from(JSON.stringify(liqpay_data)).toString('base64');
    const liqpay_signature = crypto
        .createHash('sha1')
        .update(`${'sandbox_FRDaasO0MmnhPbbp9U3d8DylKxr6ah8ppwkWKCcY'}${liqpay_data_str}${'sandbox_FRDaasO0MmnhPbbp9U3d8DylKxr6ah8ppwkWKCcY'}`)
        .digest('base64');

    try {
        const response = await axios.post('https://www.liqpay.ua/api/request', {
            data: liqpay_data_str,
            signature: liqpay_signature,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const response_data = response.data;

        if (response_data.status === 'sandbox' || response_data.status === 'success' || response_data.status === 'subscribed') {
            console.log(response_data)
            res.json({ success: true, message: "Payment successful.", dateStart: response_data.create_date, dateEnd: response_data.end_date });
        } else {
            res.json({ success: false, message: `Payment was not completed. Please try again. ${response_data}` });
            console.log(response_data)
            console.log({
                data: liqpay_data_str,
                signature: liqpay_signature
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});


app.post('/api/unsubs', async (req, res) => {
    const { order_id } = req.body;

    const liqpay_data = {
        public_key: 'sandbox_i38312250017',
        version: '3',
        action: 'unsubscribe',
        order_id: order_id
    };
    console.log(order_id)
    const liqpay_data_str = Buffer.from(JSON.stringify(liqpay_data)).toString('base64');
    const liqpay_signature = crypto
        .createHash('sha1')
        .update(`${'sandbox_FRDaasO0MmnhPbbp9U3d8DylKxr6ah8ppwkWKCcY'}${liqpay_data_str}${'sandbox_FRDaasO0MmnhPbbp9U3d8DylKxr6ah8ppwkWKCcY'}`)
        .digest('base64');

    try {
        const response = await axios.post('https://www.liqpay.ua/api/request', {
            data: liqpay_data_str,
            signature: liqpay_signature,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const response_data = response.data;

        if (response_data.status === 'sandbox' || response_data.status === 'success' || response_data.status === 'unsubscribe') {
            console.log(response_data)
            res.json({ success: true, message: "Unsubscribed", dateStart: response_data.create_date, dateEnd: response_data.end_date });
        } else {
            res.json({ success: false, message: `Payment was not completed. Please try again. ${response_data}` });
            console.log(response_data)
            console.log({
                data: liqpay_data_str,
                signature: liqpay_signature
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

app.put('/api/update-order', async (req, res) => {
    const { userName, orderId } = req.body;

    try {
        const user = await Subscriptions.findOneAndUpdate(
            { userName: userName },
            { $set: { order_id: orderId } },
            { new: true, upsert: true }
        );

        if (user) {
            console.log(orderId)
            res.status(200).json({ message: 'Order ID updated successfully', user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating Order ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/getOrderId', async (req, res) => {
    try {
        const seminar = await Subscriptions.find();
        res.json(seminar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));