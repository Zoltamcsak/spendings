package org.spendings.web.rest;

import org.spendings.SpendingsApp;

import org.spendings.domain.Spending;
import org.spendings.repository.SpendingRepository;
import org.spendings.service.SpendingService;
import org.spendings.service.dto.SpendingDTO;
import org.spendings.service.mapper.SpendingMapper;
import org.spendings.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.spendings.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the SpendingResource REST controller.
 *
 * @see SpendingResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SpendingsApp.class)
public class SpendingResourceIntTest {

    private static final Long DEFAULT_PRICE = 1L;
    private static final Long UPDATED_PRICE = 2L;

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private SpendingRepository spendingRepository;

    @Autowired
    private SpendingMapper spendingMapper;

    @Autowired
    private SpendingService spendingService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSpendingMockMvc;

    private Spending spending;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SpendingResource spendingResource = new SpendingResource(spendingService);
        this.restSpendingMockMvc = MockMvcBuilders.standaloneSetup(spendingResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Spending createEntity(EntityManager em) {
        Spending spending = new Spending()
            .price(DEFAULT_PRICE)
            .date(DEFAULT_DATE);
        return spending;
    }

    @Before
    public void initTest() {
        spending = createEntity(em);
    }

    @Test
    @Transactional
    public void createSpending() throws Exception {
        int databaseSizeBeforeCreate = spendingRepository.findAll().size();

        // Create the Spending
        SpendingDTO spendingDTO = spendingMapper.toDto(spending);
        restSpendingMockMvc.perform(post("/api/spendings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(spendingDTO)))
            .andExpect(status().isCreated());

        // Validate the Spending in the database
        List<Spending> spendingList = spendingRepository.findAll();
        assertThat(spendingList).hasSize(databaseSizeBeforeCreate + 1);
        Spending testSpending = spendingList.get(spendingList.size() - 1);
        assertThat(testSpending.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testSpending.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createSpendingWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = spendingRepository.findAll().size();

        // Create the Spending with an existing ID
        spending.setId(1L);
        SpendingDTO spendingDTO = spendingMapper.toDto(spending);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSpendingMockMvc.perform(post("/api/spendings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(spendingDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Spending in the database
        List<Spending> spendingList = spendingRepository.findAll();
        assertThat(spendingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllSpendings() throws Exception {
        // Initialize the database
        spendingRepository.saveAndFlush(spending);

        // Get all the spendingList
        restSpendingMockMvc.perform(get("/api/spendings?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(spending.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    public void getSpending() throws Exception {
        // Initialize the database
        spendingRepository.saveAndFlush(spending);

        // Get the spending
        restSpendingMockMvc.perform(get("/api/spendings/{id}", spending.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(spending.getId().intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSpending() throws Exception {
        // Get the spending
        restSpendingMockMvc.perform(get("/api/spendings/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSpending() throws Exception {
        // Initialize the database
        spendingRepository.saveAndFlush(spending);
        int databaseSizeBeforeUpdate = spendingRepository.findAll().size();

        // Update the spending
        Spending updatedSpending = spendingRepository.findOne(spending.getId());
        // Disconnect from session so that the updates on updatedSpending are not directly saved in db
        em.detach(updatedSpending);
        updatedSpending
            .price(UPDATED_PRICE)
            .date(UPDATED_DATE);
        SpendingDTO spendingDTO = spendingMapper.toDto(updatedSpending);

        restSpendingMockMvc.perform(put("/api/spendings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(spendingDTO)))
            .andExpect(status().isOk());

        // Validate the Spending in the database
        List<Spending> spendingList = spendingRepository.findAll();
        assertThat(spendingList).hasSize(databaseSizeBeforeUpdate);
        Spending testSpending = spendingList.get(spendingList.size() - 1);
        assertThat(testSpending.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testSpending.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingSpending() throws Exception {
        int databaseSizeBeforeUpdate = spendingRepository.findAll().size();

        // Create the Spending
        SpendingDTO spendingDTO = spendingMapper.toDto(spending);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSpendingMockMvc.perform(put("/api/spendings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(spendingDTO)))
            .andExpect(status().isCreated());

        // Validate the Spending in the database
        List<Spending> spendingList = spendingRepository.findAll();
        assertThat(spendingList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSpending() throws Exception {
        // Initialize the database
        spendingRepository.saveAndFlush(spending);
        int databaseSizeBeforeDelete = spendingRepository.findAll().size();

        // Get the spending
        restSpendingMockMvc.perform(delete("/api/spendings/{id}", spending.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Spending> spendingList = spendingRepository.findAll();
        assertThat(spendingList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Spending.class);
        Spending spending1 = new Spending();
        spending1.setId(1L);
        Spending spending2 = new Spending();
        spending2.setId(spending1.getId());
        assertThat(spending1).isEqualTo(spending2);
        spending2.setId(2L);
        assertThat(spending1).isNotEqualTo(spending2);
        spending1.setId(null);
        assertThat(spending1).isNotEqualTo(spending2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(SpendingDTO.class);
        SpendingDTO spendingDTO1 = new SpendingDTO();
        spendingDTO1.setId(1L);
        SpendingDTO spendingDTO2 = new SpendingDTO();
        assertThat(spendingDTO1).isNotEqualTo(spendingDTO2);
        spendingDTO2.setId(spendingDTO1.getId());
        assertThat(spendingDTO1).isEqualTo(spendingDTO2);
        spendingDTO2.setId(2L);
        assertThat(spendingDTO1).isNotEqualTo(spendingDTO2);
        spendingDTO1.setId(null);
        assertThat(spendingDTO1).isNotEqualTo(spendingDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(spendingMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(spendingMapper.fromId(null)).isNull();
    }
}
