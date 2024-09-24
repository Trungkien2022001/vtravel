insert into hotel (hotel_id, best_price_combination)
SELECT 
    rr.hotel_id,
    json_agg(
        json_build_object(
            'room_id', rr.room_id,
            'rate_code', rr.rate_code,
            'rate_name', rr.rate_name,
            'full_rate', rr.full_rate,
            'is_has_extra_bed', rr.is_has_extra_bed,
            'extra_bed_rate', rr.extra_bed_rate,
            'extra_children', rr.extra_children,
            'extra_infant', rr.extra_infant,
            'cancellation_policies', rr.cancellation_policies,
            'tax', rr.tax,
            'fee', rr.fee,
            'currency': rr.currency
        )
    ) AS best_price_combination
FROM (
    SELECT 
        hotel_id,
        room_id,
        MIN(full_rate) AS full_rate
    FROM room_rate
--    WHERE hotel_id = '95413036'
    GROUP BY hotel_id, room_id
) rr2
INNER JOIN room_rate rr ON rr.hotel_id = rr2.hotel_id AND rr.full_rate = rr2.full_rate
GROUP BY rr.hotel_id;