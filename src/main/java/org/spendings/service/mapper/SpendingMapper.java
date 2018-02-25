package org.spendings.service.mapper;

import org.spendings.domain.*;
import org.spendings.service.dto.SpendingDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Spending and its DTO SpendingDTO.
 */
@Mapper(componentModel = "spring", uses = {ItemMapper.class, UserMapper.class})
public interface SpendingMapper extends EntityMapper<SpendingDTO, Spending> {

    @Mapping(source = "item.id", target = "itemId")
    @Mapping(source = "user.id", target = "userId")
    SpendingDTO toDto(Spending spending);

    @Mapping(source = "itemId", target = "item")
    @Mapping(source = "userId", target = "user")
    Spending toEntity(SpendingDTO spendingDTO);

    default Spending fromId(Long id) {
        if (id == null) {
            return null;
        }
        Spending spending = new Spending();
        spending.setId(id);
        return spending;
    }
}
