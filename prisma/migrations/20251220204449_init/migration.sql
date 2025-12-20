-- CreateTable
CREATE TABLE "dictionary" (
    "id" SERIAL NOT NULL,
    "entity_type" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "scientific_name" TEXT,
    "notes" TEXT,

    CONSTRAINT "dictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phenology" (
    "id" SERIAL NOT NULL,
    "bbch_code" INTEGER NOT NULL,
    "stage_name_ru" TEXT NOT NULL,
    "gdd_threshold_base5" INTEGER NOT NULL,
    "description" TEXT,
    "image_link" TEXT,
    "source_url" TEXT,

    CONSTRAINT "phenology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diseases" (
    "id" SERIAL NOT NULL,
    "disease_code" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "temp_f" INTEGER,
    "temp_c" DOUBLE PRECISION,
    "leaf_wetness_hours_light" INTEGER,
    "leaf_wetness_hours_moderate" INTEGER,
    "leaf_wetness_hours_severe" INTEGER,
    "notes" TEXT,
    "source_url" TEXT,

    CONSTRAINT "diseases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition" (
    "id" SERIAL NOT NULL,
    "parameter" TEXT NOT NULL,
    "value" TEXT,
    "unit" TEXT,
    "category" TEXT,
    "notes" TEXT,
    "source_url" TEXT,

    CONSTRAINT "nutrition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pesticides" (
    "id" SERIAL NOT NULL,
    "trade_name" TEXT NOT NULL,
    "active_ingredient" TEXT NOT NULL,
    "target_pest_codes" TEXT NOT NULL,
    "dosage_min_l_ha" DOUBLE PRECISION,
    "dosage_max_l_ha" DOUBLE PRECISION,
    "dosage_unit" TEXT NOT NULL,
    "min_temp_c" INTEGER,
    "max_temp_c" INTEGER,
    "rainfastness_hours" INTEGER,
    "action_type" TEXT NOT NULL,
    "phi_days" INTEGER,
    "frac_irac" TEXT,
    "chem_group_code" TEXT,
    "notes" TEXT,
    "source_url" TEXT,

    CONSTRAINT "pesticides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather_parameters" (
    "id" SERIAL NOT NULL,
    "parameter" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "description" TEXT,
    "source_url" TEXT,

    CONSTRAINT "weather_parameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compatibility" (
    "id" SERIAL NOT NULL,
    "chem_group_1" TEXT NOT NULL,
    "chem_group_2" TEXT NOT NULL,
    "compatibility" TEXT NOT NULL,

    CONSTRAINT "compatibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_protocols" (
    "id" SERIAL NOT NULL,
    "rule_id" TEXT NOT NULL,
    "trigger_type" TEXT NOT NULL,
    "entity_code" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "threshold" TEXT NOT NULL,
    "window" TEXT NOT NULL,
    "if_yes_action" TEXT NOT NULL,
    "if_no_action" TEXT NOT NULL,
    "constraints" TEXT,
    "link_to_pesticides_db" TEXT,
    "notes" TEXT,
    "source_url" TEXT,

    CONSTRAINT "emergency_protocols_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dictionary_code_key" ON "dictionary"("code");

-- CreateIndex
CREATE UNIQUE INDEX "phenology_bbch_code_key" ON "phenology"("bbch_code");

-- CreateIndex
CREATE UNIQUE INDEX "weather_parameters_parameter_key" ON "weather_parameters"("parameter");

-- CreateIndex
CREATE UNIQUE INDEX "compatibility_chem_group_1_chem_group_2_key" ON "compatibility"("chem_group_1", "chem_group_2");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_protocols_rule_id_key" ON "emergency_protocols"("rule_id");
