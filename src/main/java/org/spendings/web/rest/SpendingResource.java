package org.spendings.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.spendings.service.SpendingService;
import org.spendings.web.rest.errors.BadRequestAlertException;
import org.spendings.web.rest.util.HeaderUtil;
import org.spendings.service.dto.SpendingDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Spending.
 */
@RestController
@RequestMapping("/api")
public class SpendingResource {

    private final Logger log = LoggerFactory.getLogger(SpendingResource.class);

    private static final String ENTITY_NAME = "spending";

    private final SpendingService spendingService;

    public SpendingResource(SpendingService spendingService) {
        this.spendingService = spendingService;
    }

    @GetMapping("/spendings/betweenDates/{startDate}/{endDate}")
    public List<SpendingDTO> findSpendingByDateBetween(@PathVariable LocalDate startDate, @PathVariable LocalDate endDate) {
        log.debug("REST request to find Spending between dates : {} {}", startDate, endDate);
        return spendingService.findByDateBetween(startDate, endDate);
    }

    /**
     * POST  /spendings : Create a new spending.
     *
     * @param spendingDTO the spendingDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new spendingDTO, or with status 400 (Bad Request) if the spending has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/spendings")
    @Timed
    public ResponseEntity<SpendingDTO> createSpending(@RequestBody SpendingDTO spendingDTO) throws URISyntaxException {
        log.debug("REST request to save Spending : {}", spendingDTO);
        if (spendingDTO.getId() != null) {
            throw new BadRequestAlertException("A new spending cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SpendingDTO result = spendingService.save(spendingDTO);
        return ResponseEntity.created(new URI("/api/spendings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /spendings : Updates an existing spending.
     *
     * @param spendingDTO the spendingDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated spendingDTO,
     * or with status 400 (Bad Request) if the spendingDTO is not valid,
     * or with status 500 (Internal Server Error) if the spendingDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/spendings")
    @Timed
    public ResponseEntity<SpendingDTO> updateSpending(@RequestBody SpendingDTO spendingDTO) throws URISyntaxException {
        log.debug("REST request to update Spending : {}", spendingDTO);
        if (spendingDTO.getId() == null) {
            return createSpending(spendingDTO);
        }
        SpendingDTO result = spendingService.save(spendingDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, spendingDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /spendings : get all the spendings.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of spendings in body
     */
    @GetMapping("/spendings")
    @Timed
    public List<SpendingDTO> getAllSpendings() {
        log.debug("REST request to get all Spendings");
        return spendingService.findAll();
        }

    /**
     * GET  /spendings/:id : get the "id" spending.
     *
     * @param id the id of the spendingDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the spendingDTO, or with status 404 (Not Found)
     */
    @GetMapping("/spendings/{id}")
    @Timed
    public ResponseEntity<SpendingDTO> getSpending(@PathVariable Long id) {
        log.debug("REST request to get Spending : {}", id);
        SpendingDTO spendingDTO = spendingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(spendingDTO));
    }

    /**
     * DELETE  /spendings/:id : delete the "id" spending.
     *
     * @param id the id of the spendingDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/spendings/{id}")
    @Timed
    public ResponseEntity<Void> deleteSpending(@PathVariable Long id) {
        log.debug("REST request to delete Spending : {}", id);
        spendingService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
