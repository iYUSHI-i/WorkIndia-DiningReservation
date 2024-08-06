exports.bookSlot = async(req,res) =>{
    const{ place_id, start_time, end_time} = req.body;
    const user_id = req.user.user_id;

    try{
        const [existingBookings] = await db.query(
            'SELECT * FROM bookings WHERE place_id = ? AND ((start_time BETWEEN ? AND ?) OR (end_time BETWEEN ? AND ? ))',
            [place_id, start_time, end_time, start_time, end_time]
        );

        if(existingBookings.length > 0){
            return res.status(400).json({
              status: 'Slot is not available',
              status_code: 400  
            });
        }

        const [result]= await db.query(

            'INSERT INTO bookings (place_id, user_id, start_time, end_time) VALUES (?,?,?,?)',
            [place_id,user_id,start_time,end_time]
        );

        res.status(200).json({
            status: 'Slot booked successfully',
            status_code: 200,
            booking_id: result.insertId
        });

    }catch (err){
        res.status(500).json({ status: 'Database error', status_code: 500});

    }
};