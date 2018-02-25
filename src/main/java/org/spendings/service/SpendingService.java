package org.spendings.service;

import org.spendings.service.dto.SpendingDTO;
import java.util.List;

/**
 * Service Interface for managing Spending.
 */
public interface SpendingService {

    /**
     * Save a spending.
     *
     * @param spendingDTO the entity to save
     * @return the persisted entity
     */
    SpendingDTO save(SpendingDTO spendingDTO);

    /**
     * Get all the spendings.
     *
     * @return the list of entities
     */
    List<SpendingDTO> findAll();

    /**
     * Get the "id" spending.
     *
     * @param id the id of the entity
     * @return the entity
     */
    SpendingDTO findOne(Long id);

    /**
     * Delete the "id" spending.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
