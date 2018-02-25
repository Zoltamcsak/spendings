package org.spendings.service.mapper;

import org.spendings.domain.*;
import org.spendings.service.dto.ItemDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Item and its DTO ItemDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ItemMapper extends EntityMapper<ItemDTO, Item> {



    default Item fromId(Long id) {
        if (id == null) {
            return null;
        }
        Item item = new Item();
        item.setId(id);
        return item;
    }
}
