"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBiddingDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_bidding_dto_1 = require("./create-bidding.dto");
class UpdateBiddingDto extends (0, mapped_types_1.PartialType)(create_bidding_dto_1.CreateBiddingDto) {
}
exports.UpdateBiddingDto = UpdateBiddingDto;
//# sourceMappingURL=update-bidding.dto.js.map