exports.createDiningPlace = async (req,res) =>{
    const { name, address, phone_no, website, operational_hours, booked_slot}= req.body;

    try{
        const [result]= await db.query(
            'INSERT INTO dining_places (name, address, phone_no, website, open_time, close_time) VALUES (?,?,?,?,?,?)',
            [name, address, phone_no, website,operational_hours.open_time, operational_hours.close_time]

        );

        res.status(200).json({
            message: `${name} added successfully`,
            place_id: result.insertId,
            status_code: 200
        });
    } catch(err){
        res.status(500).json({ status: 'Database error', status_code: 500});
    }
};

exports.searchDiningPlaces = async (req,res) =>{
    const{name} = req.query;

    try{
        const [rows] = await db.query('SELECT * FROM dining_places WHERE name LIKE ?', [`%${name}%`]);

        res.status(200).json({
            results: rows,
            status_code: 200
        });
    }catch(err){
        res.status(500).json({status: 'Database error', status_code: 500});

    }
};
exports.getAvailability = async( req,res)=>{
    const { place_id, start_time, end_time }= req.query;


try{
        const[ rows] = await db.query(
            'SELECT * FROM bookings WHERE place_id= ? AND (( start_time BETWEEN ? AND ?) OR (end_time BETWEEN ? AND ?))',
            [place_id, start_time, end_time, start_time, end_time]
        );

        if(rows.length ===0){
            res.status(200).json({
                place_id,
                available: true,
                next_available_slot: null
            });
        } else {
            const [nextAvailable] =await db.query(
                'SELECT end_time FROM bookings WHERE place_id= ? AND end_time > ? ORDER BY end_time ASC LIMIT 1',
                [place_id, end_time]
            );
            res.status(200).json({
                place_id,
                available: false,
                next_available_slot: nextAvailable ? nextAvailable.end_time : null
            });
        }
    } catch (err){
        res.status(500).json({ status: 'Database error:', status_code: 500});

    }
};