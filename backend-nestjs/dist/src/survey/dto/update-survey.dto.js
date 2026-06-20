"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSurveyDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_survey_dto_1 = require("./create-survey.dto");
class UpdateSurveyDto extends (0, mapped_types_1.PartialType)(create_survey_dto_1.CreateSurveyDto) {
}
exports.UpdateSurveyDto = UpdateSurveyDto;
//# sourceMappingURL=update-survey.dto.js.map