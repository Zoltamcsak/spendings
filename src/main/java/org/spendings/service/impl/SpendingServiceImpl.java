package org.spendings.service.impl;

import org.spendings.service.SpendingService;
import org.spendings.domain.Spending;
import org.spendings.repository.SpendingRepository;
import org.spendings.service.dto.SpendingDTO;
import org.spendings.service.mapper.SpendingMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing Spending.
 */
@Service
@Transactional
public class SpendingServiceImpl implements SpendingService {

    private final Logger log = LoggerFactory.getLogger(SpendingServiceImpl.class);

    private final SpendingRepository spendingRepository;

    private final SpendingMapper spendingMapper;

    public SpendingServiceImpl(SpendingRepository spendingRepository, SpendingMapper spendingMapper) {
        this.spendingRepository = spendingRepository;
        this.spendingMapper = spendingMapper;
    }

    /**
     * Save a spending.
     *
     * @param spendingDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public SpendingDTO save(SpendingDTO spendingDTO) {
        log.debug("Request to save Spending : {}", spendingDTO);
        Spending spending = spendingMapper.toEntity(spendingDTO);
        spending = spendingRepository.save(spending);
        return spendingMapper.toDto(spending);
    }

    /**
     * Get all the spendings.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<SpendingDTO> findAll() {
        log.debug("Request to get all Spendings");
        return spendingRepository.findAll().stream()
            .map(spendingMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one spending by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public SpendingDTO findOne(Long id) {
        log.debug("Request to get Spending : {}", id);
        Spending spending = spendingRepository.findOne(id);
        return spendingMapper.toDto(spending);
    }

    /**
     * Delete the spending by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Spending : {}", id);
        spendingRepository.delete(id);
    }
}
