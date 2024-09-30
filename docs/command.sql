UPDATE tour
SET 
    minimum_pax = tr_data.minimum_pax,
    best_price_combination = tr_data.best_price_combination
FROM (
    SELECT 
        tr.tour_id,
        tr.minimum_pax,
        jsonb_agg(json_build_object(
            'available_times', tr.available_times,
            'rate_detail', tr.rate_detail,
            'name', tr.name,
            'full_rate', tr.full_rate,
            'cancellation_policies', tr.cancellation_policies,
            'extra_adult', tr.extra_adult,
            'extra_children', tr.extra_children
        )) AS best_price_combination
    FROM (
        SELECT
            tr2.tour_id,
            MIN(full_rate) AS full_rate
        FROM tour_rate tr2
        GROUP BY tr2.tour_id
    ) tr2
    INNER JOIN tour_rate tr ON tr.tour_id = tr2.tour_id AND tr.full_rate = tr2.full_rate
    WHERE tr.is_active = true
    GROUP BY tr.tour_id, tr.minimum_pax
) AS tr_data
WHERE tour.tour_id = tr_data.tour_id;
-- 
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