import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AppError } from 'src/common';
import { SEARCH_ERROR } from 'src/shared/constants';
@Injectable()
export class BaseVehicleSearchProcessor {
  constructor(protected readonly entityManager: EntityManager) {}
  async search(body: any, agentId: number) {
    throw new AppError(SEARCH_ERROR.METHOD_NOT_IMPLEMENT);
  }

  async getMapping(request, provider) {
    const mapping = await Promise.all([
      this.mapDestination(provider.code, request.pick_up.location),
      this.mapDestination(provider.code, request.drop_off.location),
    ]);

    return {
      pickUp: mapping[0][0],
      dropOff: mapping[1][0],
    };
  }

  async mapDestination(supplierCode, destinationCode) {
    return this.entityManager.query(
      `
       SELECT 
        vpdm.source_dest_code,
        vpdm.source_country_code,
        a.latitude,
        a.longitude,
        a.country_code
    FROM 
        vehicle_provider_destination_mapping AS vpdm
    LEFT JOIN 
        airport AS a 
    ON 
        vpdm.destination_code = a.airport_code
    WHERE 
        vpdm.supplier_code = $1
    AND 
        vpdm.destination_code = $2
      `,
      [supplierCode, destinationCode],
    );
  }
}
